export const authCheck = (store, menuCode, auth, userId) => {
  if (!menuCode && !auth && !userId) return true;

  const authStore = store.auth.data;
  const profileStore = store.profile;

  return (
    authStore.filter(
      (item) =>
        item.menu === menuCode && item.auth.toUpperCase().includes(auth.toUpperCase())
    ).length > 0 ||
    userId === profileStore.id ||
    (Array.isArray(userId) && userId.includes(profileStore.id))
  );
};
