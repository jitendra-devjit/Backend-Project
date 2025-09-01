const asyncHandler = (requestHandler) => (req, res, next) =>
  Promise.resolve(requestHandler(req, res, next)).catch(next);

export default asyncHandler;



// const asyncHandler = (fnc) => async (req, res, next) => {
//     try {
//         await fnc(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             status: "false",
//             message: error.message || "Internal Server Error",
//         });
//     }
// };

export { asyncHandler }; 
