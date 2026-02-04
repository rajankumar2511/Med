export const isDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Doctor access only" });
  }
  next();
};

export const isPatient = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Patient access only" });
  }
  next();
};
