/**
 * Панель свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.Body',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		id: 'panel-props-body',
		xtype: 'panel-props-body',
		html: 'Панель свойств редактора текста',

		getContentId: function ()
		{
			return 'main-htmleditor';
		}
	}
);