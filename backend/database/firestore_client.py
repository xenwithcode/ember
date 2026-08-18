"""
Firestore client - central access point for Google Cloud Firestore.

The rest of the backend imports `db` from this module. If Google Cloud
credentials are not available (local dev without a service account), it
falls back to an in-memory stub so the server can still boot.
"""

import os

try:
    from google.cloud import firestore
    _FIRESTORE_AVAILABLE = True
except ImportError:
    _FIRESTORE_AVAILABLE = False


class _InMemorySnapshot:
    """Firestore-like snapshot (exists, id, to_dict) for stub reads."""

    def __init__(self, doc_id: str, data: dict | None):
        self.id = doc_id
        self._data = data

    @property
    def exists(self) -> bool:
        return self._data is not None

    def to_dict(self) -> dict:
        return self._data


class _InMemoryCollection:
    """Minimal in-memory stand-in for a Firestore collection."""

    def __init__(self, name: str):
        self.name = name
        self._docs: dict[str, dict] = {}

    def document(self, doc_id: str | None = None):
        if doc_id is None:
            doc_id = f"auto_{len(self._docs) + 1}"
        return _InMemoryDocumentRef(self, doc_id)

    def where(self, *args, **kwargs):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self

    def get(self):
        return [self._snapshot(doc_id) for doc_id, data in self._docs.items()]

    def stream(self):
        return self.get()

    def _snapshot(self, doc_id: str) -> "_InMemorySnapshot":
        return _InMemorySnapshot(doc_id, self._docs.get(doc_id))


class _MissingSnapshot:
    """Firestore-like snapshot for a document that does not exist."""

    exists = False
    id = ""

    def to_dict(self):
        return None


class _InMemoryDocumentRef:
    """In-memory document reference with Firestore-like behavior."""

    def __init__(self, collection: "_InMemoryCollection", doc_id: str):
        self.collection = collection
        self.id = doc_id

    def get(self) -> _InMemorySnapshot:
        data = self.collection._docs.get(self.id)
        if data is None:
            return _MissingSnapshot()
        return _InMemorySnapshot(self.id, data)

    def set(self, data: dict):
        self.collection._docs[self.id] = data

    def create(self, data: dict):
        self.collection._docs[self.id] = data

    def update(self, data: dict):
        current = self.collection._docs.get(self.id)
        if current is None:
            current = {}
        current.update(data)
        self.collection._docs[self.id] = current

    def delete(self):
        self.collection._docs.pop(self.id, None)

    def exist(self) -> bool:
        return self.id in self.collection._docs


class _InMemoryClient:
    """In-memory Firestore client used when GCP credentials are missing."""

    def __init__(self):
        self._collections: dict[str, _InMemoryCollection] = {}

    def collection(self, name: str):
        if name not in self._collections:
            self._collections[name] = _InMemoryCollection(name)
        return self._collections[name]


class FirestoreDB:
    """Singleton wrapper around the Firestore client."""

    def __init__(self):
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
        if _FIRESTORE_AVAILABLE and credentials_path and os.path.exists(credentials_path):
            try:
                self.client = firestore.Client()
                self._using_stub = False
            except Exception:
                self.client = _InMemoryClient()
                self._using_stub = True
        else:
            self.client = _InMemoryClient()
            self._using_stub = True

    @property
    def using_stub(self) -> bool:
        return self._using_stub

    def get_user_profile(self, user_id: str) -> dict | None:
        """Fetch a user's Identity Graph profile from Firestore."""
        try:
            doc = (
                self.client.collection("users").document(user_id).get()
            )
            if doc is None or not getattr(doc, "exists", False):
                return None
            return doc.to_dict() if hasattr(doc, "to_dict") else doc
        except Exception as e:
            print(f"⚠️  get_user_profile failed: {e}")
            return None


db = FirestoreDB()