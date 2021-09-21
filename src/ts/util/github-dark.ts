export default {
  name: 'github-dark-dimmed',
  base: 'vs-dark',
  inherit: true,
  rules: [
    {
      token: 'comment',
      foreground: '#6A737D',
    },
    {
      token: 'punctuation.definition.comment',
      foreground: '#6A737D',
    },
    {
      token: 'string.comment',
      foreground: '#6A737D',
    },
    {
      token: 'constant',
      foreground: '#79B8FF',
    },
    {
      token: 'entity.name.constant',
      foreground: '#79B8FF',
    },
    {
      token: 'variable.other.constant',
      foreground: '#79B8FF',
    },
    {
      token: 'variable.language',
      foreground: '#79B8FF',
    },
    {
      token: 'entity',
      foreground: '#B392F0',
    },
    {
      token: 'entity.name',
      foreground: '#B392F0',
    },
    {
      token: 'variable.parameter.function',
      foreground: '#E1E4E8',
    },
    {
      token: 'entity.name.tag',
      foreground: '#85E89D',
    },
    {
      token: 'keyword',
      foreground: '#F97583',
    },
    {
      token: 'storage',
      foreground: '#F97583',
    },
    {
      token: 'storage.type',
      foreground: '#F97583',
    },
    {
      token: 'storage.modifier.package',
      foreground: '#E1E4E8',
    },
    {
      token: 'storage.modifier.import',
      foreground: '#E1E4E8',
    },
    {
      token: 'storage.type.java',
      foreground: '#E1E4E8',
    },
    {
      token: 'string',
      foreground: '#9ECBFF',
    },
    {
      token: 'punctuation.definition.string',
      foreground: '#9ECBFF',
    },
    {
      token: 'string punctuation.section.embedded source',
      foreground: '#9ECBFF',
    },
    {
      token: 'support',
      foreground: '#79B8FF',
    },
    {
      token: 'meta.property-name',
      foreground: '#79B8FF',
    },
    {
      token: 'variable',
      foreground: '#FFAB70',
    },
    {
      token: 'variable.other',
      foreground: '#E1E4E8',
    },
    {
      token: 'invalid.broken',
      foreground: '#FDAEB7',
      fontStyle: 'italic'
    },
    {
      token: 'invalid.deprecated',
      foreground: '#FDAEB7',
      fontStyle: 'italic'
    },
    {
      token: 'invalid.illegal',
      foreground: '#FDAEB7',
      fontStyle: 'italic'
    },
    {
      token: 'invalid.unimplemented',
      foreground: '#FDAEB7',
      fontStyle: 'italic'
    },
    {
      token: 'carriage-return',
      foreground: '#24292E',
      background: '#F97583',
      fontStyle: 'italic underline'
    },
    {
      token: 'message.error',
      foreground: '#FDAEB7',
    },
    {
      token: 'string source',
      foreground: '#E1E4E8',
    },
    {
      token: 'string variable',
      foreground: '#79B8FF',
    },
    {
      token: 'source.regexp',
      foreground: '#DBEDFF',
    },
    {
      token: 'string.regexp',
      foreground: '#DBEDFF',
    },
    {
      token: 'string.regexp.character-class',
      foreground: '#DBEDFF',
    },
    {
      token: 'string.regexp constant.character.escape',
      foreground: '#DBEDFF',
    },
    {
      token: 'string.regexp source.ruby.embedded',
      foreground: '#DBEDFF',
    },
    {
      token: 'string.regexp string.regexp.arbitrary-repitition',
      foreground: '#DBEDFF',
    },
    {
      token: 'string.regexp constant.character.escape',
      foreground: '#85E89D',
      fontStyle: 'bold'
    },
    {
      token: 'support.constant',
      foreground: '#79B8FF',
    },
    {
      token: 'support.variable',
      foreground: '#79B8FF',
    },
    {
      token: 'meta.module-reference',
      foreground: '#79B8FF',
    },
    {
      token: 'punctuation.definition.list.begin.markdown',
      foreground: '#FFAB70',
    },
    {
      token: 'markup.heading',
      foreground: '#79B8FF',
      fontStyle: 'bold'
    },
    {
      token: 'markup.heading entity.name',
      foreground: '#79B8FF',
      fontStyle: 'bold'
    },
    {
      token: 'markup.quote',
      foreground: '#85E89D',
    },
    {
      token: 'markup.italic',
      foreground: '#E1E4E8',
      fontStyle: 'italic'
    },
    {
      token: 'markup.bold',
      foreground: '#E1E4E8',
      fontStyle: 'bold'
    },
    {
      token: 'markup.raw',
      foreground: '#79B8FF',
    },
    {
      token: 'markup.deleted',
      foreground: '#FDAEB7',
      background: '#86181D',
    },
    {
      token: 'meta.diff.header.from-file',
      foreground: '#FDAEB7',
      background: '#86181D',
    },
    {
      token: 'punctuation.definition.deleted',
      foreground: '#FDAEB7',
      background: '#86181D',
    },
    {
      token: 'markup.inserted',
      foreground: '#85E89D',
      background: '#144620',
    },
    {
      token: 'meta.diff.header.to-file',
      foreground: '#85E89D',
      background: '#144620',
    },
    {
      token: 'punctuation.definition.inserted',
      foreground: '#85E89D',
      background: '#144620',
    },
    {
      token: 'markup.changed',
      foreground: '#FFAB70',
      background: '#C24E00',
    },
    {
      token: 'punctuation.definition.changed',
      foreground: '#FFAB70',
      background: '#C24E00',
    },
    {
      token: 'markup.ignored',
      foreground: '#2F363D',
      background: '#79B8FF',
    },
    {
      token: 'markup.untracked',
      foreground: '#2F363D',
      background: '#79B8FF',
    },
    {
      token: 'meta.diff.range',
      foreground: '#B392F0',
      fontStyle: 'bold'
    },
    {
      token: 'meta.diff.header',
      foreground: '#79B8FF',
    },
    {
      token: 'meta.separator',
      foreground: '#79B8FF',
      fontStyle: 'bold'
    },
    {
      token: 'meta.output',
      foreground: '#79B8FF',
    },
    {
      token: 'brackethighlighter.tag',
      foreground: '#D1D5DA',
    },
    {
      token: 'brackethighlighter.curly',
      foreground: '#D1D5DA',
    },
    {
      token: 'brackethighlighter.round',
      foreground: '#D1D5DA',
    },
    {
      token: 'brackethighlighter.square',
      foreground: '#D1D5DA',
    },
    {
      token: 'brackethighlighter.angle',
      foreground: '#D1D5DA',
    },
    {
      token: 'brackethighlighter.quote',
      foreground: '#D1D5DA',
    },
    {
      token: 'brackethighlighter.unmatched',
      foreground: '#FDAEB7',
    },
    {
      token: 'constant.other.reference.link',
      foreground: '#DBEDFF',
      fontStyle: 'underline'
    },
    {
      token: 'string.other.link',
      foreground: '#DBEDFF',
      fontStyle: 'underline'
    },
    {
      token: 'token.info-token',
      foreground: '#6796E6',
    },
    {
      token: 'token.warn-token',
      foreground: '#CD9731',
    },
    {
      token: 'token.error-token',
      foreground: '#F44747',
    },
    {
      token: 'token.debug-token',
      foreground: '#B267E6',
    }
  ],
  colors: {
    'activityBar.activeBackground': '#3399FF',
    'activityBar.activeBorder': '#BF0060',
    'activityBar.background': '#3399FF',
    'activityBar.border': '#1B1F23',
    'activityBar.foreground': '#15202B',
    'activityBar.inactiveForeground': '#15202B99',
    'activityBarBadge.background': '#BF0060',
    'activityBarBadge.foreground': '#E7E7E7',
    'badge.background': '#044289',
    'badge.foreground': '#C8E1FF',
    'breadcrumb.activeSelectionForeground': '#D1D5DA',
    'breadcrumb.focusForeground': '#E1E4E8',
    'breadcrumb.foreground': '#959DA5',
    'breadcrumbPicker.background': '#2B3036',
    'button.background': '#176F2C',
    'button.foreground': '#DCFFE4',
    'button.hoverBackground': '#22863A',
    'button.secondaryBackground': '#444D56',
    'button.secondaryForeground': '#FFFFFF',
    'button.secondaryHoverBackground': '#586069',
    'checkbox.background': '#444D56',
    'checkbox.border': '#1B1F23',
    'debugToolBar.background': '#2B3036',
    descriptionForeground: '#959DA5',
    'diffEditor.insertedTextBackground': '#28A74530',
    'diffEditor.removedTextBackground': '#D73A4930',
    
    "minimap.background": "#24292E",
    "minimap.hoverBackground": "#00000028",

    'dropdown.background': '#2F363D',
    'dropdown.border': '#1B1F23',
    'dropdown.foreground': '#E1E4E8',
    'dropdown.listBackground': '#24292E',
    'editor.background': '#24292E',
    'editor.findMatchBackground': '#FFD33D44',
    'editor.findMatchHighlightBackground': '#FFD33D22',
    'editor.focusedStackFrameHighlightBackground': '#2B6A3033',
    'editor.foldBackground': '#58606915',
    'editor.foreground': '#E1E4E8',
    'editor.inactiveSelectionBackground': '#3392FF22',
    'editor.lineHighlightBackground': '#2B3036',
    'editor.linkedEditingBackground': '#3392FF22',
    'editor.selectionBackground': '#3392FF44',
    'editor.selectionHighlightBackground': '#17E5E633',
    'editor.selectionHighlightBorder': '#17E5E600',
    'editor.stackFrameHighlightBackground': '#C6902625',
    'editor.wordHighlightBackground': '#17E5E600',
    'editor.wordHighlightBorder': '#17E5E699',
    'editor.wordHighlightStrongBackground': '#17E5E600',
    'editor.wordHighlightStrongBorder': '#17E5E666',
    'editorBracketMatch.background': '#17E5E650',
    'editorBracketMatch.border': '#17E5E600',
    'editorCursor.foreground': '#C8E1FF',
    'editorGroup.border': '#1B1F23',
    'editorGroupHeader.tabsBackground': '#1F2428',
    'editorGroupHeader.tabsBorder': '#1B1F23',
    'editorGutter.addedBackground': '#28A745',
    'editorGutter.deletedBackground': '#EA4A5A',
    'editorGutter.modifiedBackground': '#2188FF',
    'editorIndentGuide.activeBackground': '#444D56',
    'editorIndentGuide.background': '#2F363D',
    'editorLineNumber.activeForeground': '#E1E4E8',
    'editorLineNumber.foreground': '#444D56',
    'editorOverviewRuler.border': '#1B1F23',
    'editorWhitespace.foreground': '#444D56',
    'editorWidget.background': '#1F2428',
    errorForeground: '#F97583',
    focusBorder: '#005CC5',
    foreground: '#D1D5DA',
    'gitDecoration.addedResourceForeground': '#34D058',
    'gitDecoration.conflictingResourceForeground': '#FFAB70',
    'gitDecoration.deletedResourceForeground': '#EA4A5A',
    'gitDecoration.ignoredResourceForeground': '#6A737D',
    'gitDecoration.modifiedResourceForeground': '#79B8FF',
    'gitDecoration.submoduleResourceForeground': '#6A737D',
    'gitDecoration.untrackedResourceForeground': '#34D058',
    'input.background': '#2F363D',
    'input.border': '#1B1F23',
    'input.foreground': '#E1E4E8',
    'input.placeholderForeground': '#959DA5',
    'list.activeSelectionBackground': '#39414A',
    'list.activeSelectionForeground': '#E1E4E8',
    'list.focusBackground': '#044289',
    'list.hoverBackground': '#282E34',
    'list.hoverForeground': '#E1E4E8',
    'list.inactiveFocusBackground': '#1D2D3E',
    'list.inactiveSelectionBackground': '#282E34',
    'list.inactiveSelectionForeground': '#E1E4E8',
    'notificationCenterHeader.background': '#24292E',
    'notificationCenterHeader.foreground': '#959DA5',
    'notifications.background': '#2F363D',
    'notifications.border': '#1B1F23',
    'notifications.foreground': '#E1E4E8',
    'notificationsErrorIcon.foreground': '#EA4A5A',
    'notificationsInfoIcon.foreground': '#79B8FF',
    'notificationsWarningIcon.foreground': '#FFAB70',
    'panel.background': '#1F2428',
    'panel.border': '#1B1F23',
    'panelInput.border': '#2F363D',
    'panelTitle.activeBorder': '#F9826C',
    'panelTitle.activeForeground': '#E1E4E8',
    'panelTitle.inactiveForeground': '#959DA5',
    'peekViewEditor.background': '#1F242888',
    'peekViewEditor.matchHighlightBackground': '#FFD33D33',
    'peekViewResult.background': '#1F2428',
    'peekViewResult.matchHighlightBackground': '#FFD33D33',
    'pickerGroup.border': '#444D56',
    'pickerGroup.foreground': '#E1E4E8',
    'progressBar.background': '#0366D6',
    'quickInput.background': '#24292E',
    'quickInput.foreground': '#E1E4E8',
    'scrollbar.shadow': '#00000088',
    'settings.headerForeground': '#E1E4E8',
    'settings.modifiedItemIndicator': '#0366D6',
    'sideBar.background': '#1F2428',
    'sideBar.border': '#1B1F23',
    'sideBar.foreground': '#D1D5DA',
    'sideBarSectionHeader.background': '#1F2428',
    'sideBarSectionHeader.border': '#1B1F23',
    'sideBarSectionHeader.foreground': '#E1E4E8',
    'sideBarTitle.foreground': '#E1E4E8',
    'statusBar.background': '#007FFF',
    'statusBar.border': '#1B1F23',
    'statusBar.debuggingBackground': '#931C06',
    'statusBar.debuggingForeground': '#FFFFFF',
    'statusBar.foreground': '#E7E7E7',
    'statusBar.noFolderBackground': '#24292E',
    'statusBarItem.hoverBackground': '#3399FF',
    'statusBarItem.prominentBackground': '#282E34',
    'tab.activeBackground': '#24292E',
    'tab.activeBorder': '#24292E',
    'tab.activeBorderTop': '#F9826C',
    'tab.activeForeground': '#E1E4E8',
    'tab.border': '#1B1F23',
    'tab.hoverBackground': '#24292E',
    'tab.inactiveBackground': '#1F2428',
    'tab.inactiveForeground': '#959DA5',
    'tab.unfocusedActiveBorder': '#24292E',
    'tab.unfocusedActiveBorderTop': '#1B1F23',
    'tab.unfocusedHoverBackground': '#24292E',
    'terminal.foreground': '#D1D5DA',
    'textBlockQuote.background': '#24292E',
    'textBlockQuote.border': '#444D56',
    'textCodeBlock.background': '#2F363D',
    'textLink.activeForeground': '#C8E1FF',
    'textLink.foreground': '#79B8FF',
    'textPreformat.foreground': '#D1D5DA',
    'textSeparator.foreground': '#586069',
    'titleBar.activeBackground': '#007FFF',
    'titleBar.activeForeground': '#E7E7E7',
    'titleBar.border': '#1B1F23',
    'titleBar.inactiveBackground': '#007FFF99',
    'titleBar.inactiveForeground': '#E7E7E799',
    'tree.indentGuidesStroke': '#2F363D',
    'welcomePage.buttonBackground': '#2F363D',
    'welcomePage.buttonHoverBackground': '#444D56'
  }
}