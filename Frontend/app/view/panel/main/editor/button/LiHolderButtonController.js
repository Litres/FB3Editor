/**
 * Контроллер кнопки списков, содержащих элементы li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.LiHolderButtonController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',

		onSync: function ()
		{
            var me = this,
                btn = me.getView(),
	            name = btn.elementName,
                manager = btn.getEditorManager(),
                nodes = {},
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
			
			nodes.node = range.common;
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			els.parent = els.node.getParent();
			
			if (!els.p)
			{
				els.p = range.start.getElement().getStyleHolder();
				els.parent = els.node;
			}
			else
			{
				els.parent = els.p.getParent();
			}
			
			hash[name] = me.getHash(els.parent);
			me.verifyHash(hash);
		}
	}
);