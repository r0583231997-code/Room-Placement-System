const validateWingAndFloor = (req, res, next) => {
  const source = req.method === "GET" ? req.query : req.body;

  const { wing, floor } = source;

  const validWings = ["שמאל", "ימין", "מרכז", "חדש"];

  // בדיקת אגף
  if (wing && !validWings.includes(wing)) {
    return res.status(400).json({
      message: "לא קיים כזה אגף"
    });
  }

  // בדיקת קומה
  if (floor !== undefined) {
    if (isNaN(Number(floor))) {
      return res.status(400).json({
        message: "לא קיימת כזו קומה"
      });
    }

    const floorNumber = Number(floor);

    if (wing === "חדש") {
      if (floorNumber < 1 || floorNumber > 3) {
        return res.status(400).json({
          message: "לא קיימת כזו קומה"
        });
      }
    } else {
      if (floorNumber < 1 || floorNumber > 5) {
        return res.status(400).json({
          message: "לא קיימת כזו קומה"
        });
      }
    }

    source.floor = floorNumber;
  }

  next();
};

export default validateWingAndFloor;