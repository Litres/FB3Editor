/**
 * Панель свойств редактора xml тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.props.xml.Xml',
    {
        extend: 'FBEditor.view.panel.main.props.Abstract',

        id: 'panel-props-xml',
        xtype: 'panel-props-xml',

        getContentId: function ()
        {
            return 'main-xml';
        }
    }
);