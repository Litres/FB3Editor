/**
 * Контроллер кнопки subscription.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.subscription.SubscriptionController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.subscription',

		/**
		 * Синхронизирует кнопку, используя проверку по json-схеме.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				name = btn.elementName,
				manager = btn.getEditorManager(),
				factory = FBEditor.editor.Factory,
				nodes = {},
				els = {},
				hash = {},
				range,
				xml;
			
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
			
			if (els.parent.last().isSubscription)
			{
				me.verifyResult(false);
				return;
			}
			
			hash[name] = me.getHash(els.parent);
			me.verifyHash(hash);
		}
	}
);