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
			
			if (!els.p)
			{
				me.verifyResult(false);
				return;
			}
			
			els.parent = els.p.getParent();
			
			if (els.parent.first().isTitle)
			{
				me.verifyResult(false);
				return;
			}
			
			hash[name] = me.getHash(els.parent);
			me.verifyHash(hash);
		}
	}
);