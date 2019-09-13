/**
 * Контроллер кнопки title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.title.TitleController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.title',

		/**
		 * Синхронизирует кнопку, используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				name = btn.elementName,
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
			
			els.parent = els.p ? els.p.getParent() : els.node;
			
			//console.log(els.parent);
			//console.log(els.parent.first());
			
			if (els.parent.first().isTitle && range.collapsed)
			{
				me.verifyResult(false);
				return;
			}
			
			hash[name] = me.getHash(els.parent);
			me.verifyHash(hash);
		}
	}
);