/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.Manager',
	{
		extend: 'FBEditor.editor.Manager',

		createContent: function ()
		{
			var me = this;

			me.callParent(arguments);

			// обновляем дерево навигации по тексту
			me.updateTree();
		},

		setFocusElement: function (elOrNode, sel)
		{
			var me = this,
				panel = me.getPanelProps(),
				panelNav = me.getPanelNavigation(),
				el;

			me.callParent(arguments);

			el = me.focusElement;

			// обновляем информацию в панели свойств о выделенном элементе
			panel.fireEvent('loadData', el.getData());

			// разворачиваем узел элемента в дереве навигации по тексту
			panelNav.expandElement(el);
		},

		/**
		 * Обновляет дерево навигации по тексту.
		 */
		updateTree: function ()
		{
			var me = this,
				panel = me.getPanelNavigation();

			if (panel)
			{
				panel.loadData(me.content);
			}
			else
			{
				Ext.defer(
					function ()
					{
						me.updateTree();
					},
					200
				);
			}
		},

		/**
		 * @private
		 * Возвращает панель свойств.
		 * @return {FBEditor.view.panel.main.props.body.Body}
		 */
		getPanelProps: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeProps(),
				panel;

			panel = bridge.Ext.getCmp('panel-props-body');

			return panel;
		},

		/**
		 * @private
		 * Возвращает дерево навигации.
		 * @return {FBEditor.view.panel.treenavigation.body.Tree}
		 */
		getPanelNavigation: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeNavigation(),
				panel;

			panel = bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-body-navigation') ?
			        bridge.Ext && bridge.Ext.getCmp && bridge.Ext.getCmp('panel-body-navigation') : null;

			return panel;
		}
	}
);