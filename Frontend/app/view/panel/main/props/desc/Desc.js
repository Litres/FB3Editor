/**
 * Панель свойств редактора описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.Desc',
	{
		extend: 'FBEditor.view.panel.main.props.Abstract',
		id: 'panel-props-desc',
		xtype: 'panel-props-desc',
		html: 'Панель свойств редактора описания книги',

		getContentId: function ()
		{
			return 'form-desc';
		}
	}
);