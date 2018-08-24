/**
 * Контроллер поля ввода текста для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.textfield.TextfieldController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.xml.search.textfield',

        onChange: function (cmp, newVal, oldVal)
        {
            var me = this,
                view = me.getView(),
                searchPanel;

            searchPanel = view.getSearchPanel();
            searchPanel.fireEvent('change');
        }
    }
);