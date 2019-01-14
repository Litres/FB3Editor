/**
 * Контроллер элемента пути.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.path.el.ElController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.panel.props.body.path.el',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				el = view.getFocusEl(),
				manager = el.getManager(),
				nodes = {},
				helper;
			
			// удаляем все оверлеи в тексте
			manager.removeAllOverlays();
			
			// выделение всего элемента в тексте

			helper = el.getNodeHelper();
			nodes.node = helper.getNode();
			nodes.start = manager.getDeepFirst(nodes.node);
            nodes.last = manager.getDeepLast(nodes.node);
            
			manager.setCursor(
				{
                    focusElement: el,
					startNode: nodes.start,
                    endNode: nodes.last,
					endOffset: nodes.last.length
				}
			);
		}
	}
);