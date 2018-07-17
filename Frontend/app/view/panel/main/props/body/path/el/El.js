/**
 * Элемент пути.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.path.el.El',
	{
		extend: 'Ext.Component',
		requires: [
			'FBEditor.view.panel.main.props.body.path.el.ElController'
		],

		controller: 'panel.props.body.path.el',
		xtype: 'panel-props-body-path-el',
		cls: 'panel-props-body-path-el',

		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Модель элемента пути.
		 */
		focusEl: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.props.body.Body} Панель свойств.
		 */
		panelProps: null,
		
		constructor: function (data)
		{
			var me = this,
				focusEl = data.focusEl,
				name = focusEl.getName();

			me.focusEl = focusEl;
			me.html = '<span>' + name.toUpperCase() + '</span>';

			me.callParent(arguments);
		},

		/**
		 * Возвращает модель элемента пути.
		 * @return {FBEditor.editor.element.AbstractElement} Модель элемента пути.
		 */
		getFocusEl: function ()
		{
			return this.focusEl;
		},

		/**
		 * Возвращает панель свойств редактора текста.
		 * @return {FBEditor.view.panel.main.props.body.Body}
		 */
		getPanelProps: function ()
		{
			var me = this,
				panelProps;

			panelProps = me.panelProps || Ext.getCmp('panel-props-body');
			me.panelProps = panelProps;

			return panelProps
		}
	}
);