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
				panelProps = view.getPanelProps(),
				el = view.getFocusEl();
			
			// обновляем панель свойств с новыми данными
			panelProps.fireEvent('loadData', el);
		}
	}
);