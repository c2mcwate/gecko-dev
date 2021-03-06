/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { Cc, Ci, Cu } = require("chrome");

const BRAND_SHORT_NAME = Cc["@mozilla.org/intl/stringbundle;1"].
                         getService(Ci.nsIStringBundleService).
                         createBundle("chrome://branding/locale/brand.properties").
                         GetStringFromName("brandShortName");

const l10n = require("gcli/l10n");

exports.items = [
  {
    name: 'resize',
    description: l10n.lookup('resizeModeDesc')
  },
  {
    item: "command",
    runAt: "client",
    name: 'resize on',
    description: l10n.lookup('resizeModeOnDesc'),
    manual: l10n.lookupFormat('resizeModeManual2', [BRAND_SHORT_NAME]),
    exec: gcli_cmd_resize
  },
  {
    item: "command",
    runAt: "client",
    name: 'resize off',
    description: l10n.lookup('resizeModeOffDesc'),
    manual: l10n.lookupFormat('resizeModeManual2', [BRAND_SHORT_NAME]),
    exec: gcli_cmd_resize
  },
  {
    item: "command",
    runAt: "client",
    name: 'resize toggle',
    buttonId: "command-button-responsive",
    buttonClass: "command-button command-button-invertable",
    tooltipText: l10n.lookup("resizeModeToggleTooltip"),
    description: l10n.lookup('resizeModeToggleDesc'),
    manual: l10n.lookupFormat('resizeModeManual2', [BRAND_SHORT_NAME]),
    state: {
      isChecked: function(aTarget) {
        if (!aTarget.tab) {
          return false;
        }
        let browserWindow = aTarget.tab.ownerDocument.defaultView;
        let mgr = browserWindow.ResponsiveUI.ResponsiveUIManager;
        return mgr.isActiveForTab(aTarget.tab);
      },
      onChange: function(aTarget, aChangeHandler) {
        if (aTarget.tab) {
          let browserWindow = aTarget.tab.ownerDocument.defaultView;
          let mgr = browserWindow.ResponsiveUI.ResponsiveUIManager;
          mgr.on("on", aChangeHandler);
          mgr.on("off", aChangeHandler);
        }
      },
      offChange: function(aTarget, aChangeHandler) {
        if (aTarget.tab) {
          let browserWindow = aTarget.tab.ownerDocument.defaultView;
          let mgr = browserWindow.ResponsiveUI.ResponsiveUIManager;
          mgr.off("on", aChangeHandler);
          mgr.off("off", aChangeHandler);
        }
      },
    },
    exec: gcli_cmd_resize
  },
  {
    item: "command",
    runAt: "client",
    name: 'resize to',
    description: l10n.lookup('resizeModeToDesc'),
    params: [
      {
        name: 'width',
        type: 'number',
        description: l10n.lookup("resizePageArgWidthDesc"),
      },
      {
        name: 'height',
        type: 'number',
        description: l10n.lookup("resizePageArgHeightDesc"),
      },
    ],
    exec: gcli_cmd_resize
  }
];

function* gcli_cmd_resize(args, context) {
  let browserWindow = context.environment.chromeWindow;
  let mgr = browserWindow.ResponsiveUI.ResponsiveUIManager;
  yield mgr.handleGcliCommand(browserWindow,
                              browserWindow.gBrowser.selectedTab,
                              this.name,
                              args);
}
