export const createSubscription = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/create-subscription`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};
