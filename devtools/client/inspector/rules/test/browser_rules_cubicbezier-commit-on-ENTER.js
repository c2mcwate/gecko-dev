/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* Any copyright is dedicated to the Public Domain.
 http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Tests that a curve change in the cubic-bezier tooltip is committed when ENTER
// is pressed.

const TEST_URI = `
  <style type="text/css">
    body {
      transition: top 2s linear;
    }
  </style>
`;

add_task(function*() {
  yield addTab("data:text/html;charset=utf-8," + encodeURIComponent(TEST_URI));
  let {view} = yield openRuleView();

  info("Getting the bezier swatch element");
  let swatch = getRuleViewProperty(view, "body", "transition").valueSpan
    .querySelector(".ruleview-bezierswatch");

  yield testPressingEnterCommitsChanges(swatch, view);
});

function* testPressingEnterCommitsChanges(swatch, ruleView) {
  let bezierTooltip = ruleView.tooltips.cubicBezier;

  info("Showing the tooltip");
  let onShown = bezierTooltip.tooltip.once("shown");
  swatch.click();
  yield onShown;

  let widget = yield bezierTooltip.widget;
  info("Simulating a change of curve in the widget");
  widget.coordinates = [0.1, 2, 0.9, -1];
  let expected = "cubic-bezier(0.1, 2, 0.9, -1)";

  yield waitForSuccess(() => {
    return content.getComputedStyle(content.document.body)
      .transitionTimingFunction === expected;
  }, "Waiting for the change to be previewed on the element");

  ok(getRuleViewProperty(ruleView, "body", "transition").valueSpan.textContent
    .indexOf("cubic-bezier(") !== -1,
    "The text of the timing-function was updated");

  info("Sending RETURN key within the tooltip document");
  // Pressing RETURN ends up doing 2 rule-view updates, one for the preview and
  // one for the commit when the tooltip closes.
  let onRuleViewChanged = waitForNEvents(ruleView, "ruleview-changed", 2);
  EventUtils.sendKey("RETURN", widget.parent.ownerDocument.defaultView);
  yield onRuleViewChanged;

  is(content.getComputedStyle(content.document.body).transitionTimingFunction,
    expected, "The element's timing-function was kept after RETURN");
  ok(getRuleViewProperty(ruleView, "body", "transition").valueSpan.textContent
    .indexOf("cubic-bezier(") !== -1,
    "The text of the timing-function was kept after RETURN");
}
