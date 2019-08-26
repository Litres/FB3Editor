/**
 * Контроллер кнопки epigraph.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.epigraph.EpigraphController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.epigraph',

		/**
		 * Синхронизирует кнопку, используя проверку по json-схеме.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				name = btn.elementName,
				manager = btn.getEditorManager(),
				els = {},
				hash = {},
				range;
			
			if (!manager.availableSyncButtons())
			{
				me.verifyResult(true);
				return;
			}
			
			range = manager.getRange();
			
			if (!range || !range.common.getElement || range.common.getElement().isRoot)
			{
				me.verifyResult(false);
				return;
			}
			
			els.node = range.common.getElement();
			els.p = els.node.getStyleHolder();
			
			if (!els.p)
			{
				me.verifyResult(false);
				return;
			}
			
			if (els.p.hasParentName(name) || els.p.hasParentName('title'))
			{
				me.verifyResult(true);
				return;
			}
			
			els.parent = els.p.getParent();
			
			hash[name] = me.getHash(els.parent);
			me.verifyHash(hash);
		}
	}
);