export default function buildResponse(res, {
  message = "OK",
  status = 200,
  data = null
} = {}) {
  if (!res.headersSent) {
    if (data !== null && data !== undefined) {
      res.status(status).json({ message, data });
    } else {
      res.status(status).json({ message });
    }
  }
  return { message, status, data };
}
