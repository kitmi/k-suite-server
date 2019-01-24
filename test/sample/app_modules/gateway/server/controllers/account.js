"use strict";

require("source-map-support/register");

const commonViewState = require('../common/viewState');

exports.index = async ctx => {
  await ctx.render("account-index", {
    title: `${commonViewState.appTitle} - Account`,
    user: ctx.user
  });
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9hY2NvdW50LmpzIl0sIm5hbWVzIjpbImNvbW1vblZpZXdTdGF0ZSIsInJlcXVpcmUiLCJleHBvcnRzIiwiaW5kZXgiLCJjdHgiLCJyZW5kZXIiLCJ0aXRsZSIsImFwcFRpdGxlIiwidXNlciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFFQSxNQUFNQSxlQUFlLEdBQUdDLE9BQU8sQ0FBQyxxQkFBRCxDQUEvQjs7QUFFQUMsT0FBTyxDQUFDQyxLQUFSLEdBQWdCLE1BQU1DLEdBQU4sSUFBYTtBQUMzQixRQUFNQSxHQUFHLENBQUNDLE1BQUosQ0FBVyxlQUFYLEVBQTRCO0FBQ2hDQyxJQUFBQSxLQUFLLEVBQUcsR0FBRU4sZUFBZSxDQUFDTyxRQUFTLFlBREg7QUFFaENDLElBQUFBLElBQUksRUFBRUosR0FBRyxDQUFDSTtBQUZzQixHQUE1QixDQUFOO0FBSUQsQ0FMRCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBjb21tb25WaWV3U3RhdGUgPSByZXF1aXJlKCcuLi9jb21tb24vdmlld1N0YXRlJyk7XG5cbmV4cG9ydHMuaW5kZXggPSBhc3luYyBjdHggPT4ge1xuICBhd2FpdCBjdHgucmVuZGVyKFwiYWNjb3VudC1pbmRleFwiLCB7XG4gICAgdGl0bGU6IGAke2NvbW1vblZpZXdTdGF0ZS5hcHBUaXRsZX0gLSBBY2NvdW50YCxcbiAgICB1c2VyOiBjdHgudXNlclxuICB9KTtcbn07Il19