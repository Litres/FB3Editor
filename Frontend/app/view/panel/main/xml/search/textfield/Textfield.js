/**
 * Поле ввода текста для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.textfield.Textfield',
    {
        extend: 'Ext.form.field.Text',
        requires: [
            'FBEditor.view.panel.main.xml.search.textfield.TextfieldController'
        ],
        mixins: {
            cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
        },

        xtype: 'panel-xml-search-textfield',
        controller: 'panel.xml.search.textfield',

        listeners: {
            change: 'onChange'
        },

        getSearchPanel: function ()
        {
            return this.mixins.cmp.getSearchPanel.call(this);
        }
    }
);