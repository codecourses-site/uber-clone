import { auth, realTimeDb, storage } from "../firebase";

export const insert = async ({ key, id, payload }) => {
  await realTimeDb.ref(`${key}/${id}`).set(payload);
};

export const createAccount = async (email, password) =>
  await auth.createUserWithEmailAndPassword(email, password);

export const login = async (email, password) =>
  await auth.signInWithEmailAndPassword(email, password);

export const getSingleDataWithQuery = async ({ key, query, criteria }) => {
  if (!criteria) return;
  const snapshot = await realTimeDb
    .ref()
    .child(key)
    .orderByChild(query)
    .equalTo(criteria)
    .get();
  const val = snapshot.val();
  if (val) {
    const keys = Object.keys(val);
    return val[keys[0]];
  }
  return null;
};

export const getData = async (key) => {
  const snapshot = await realTimeDb.ref().child(key).get();
  const val = snapshot.val();
  if (val) {
    const keys = Object.keys(val);
    return keys.map((key) => val[key]);
  }
  return null;
};

export const upload = async ({ key, id, payload, entity, callback }) => {
  const uploadTask = storage.ref(`${key}/${id}`).putString(payload, "data_url");
  uploadTask.on(
    "state_changed",
    null,
    (error) => {},
    () => {
      storage
        .ref(key)
        .child(id)
        .getDownloadURL()
        .then((url) => {
          callback(entity, url);
        });
    }
  );
};

export const getRef = (child) => realTimeDb.ref().child(child);

export const getDataRealtime = (ref, callback) => {
  ref.current.on("value", function (snapshot) {
    callback(snapshot.val());
  });
};

export const getDataRealtimeQuery = ({ ref, query, criteria, callback }) => {
  ref.current
    .orderByChild(query)
    .equalTo(criteria)
    .on("value", function (snapshot) {
      callback(snapshot.val());
    });
};

export const offRealtimeDatabase = (ref) => {
  ref.off("value");
};
