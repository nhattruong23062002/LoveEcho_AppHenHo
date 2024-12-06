
export const getUserFromLocalStorage = () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Không thể lấy dữ liệu user từ localStorage:", error);
      return null;
    }
  };
  