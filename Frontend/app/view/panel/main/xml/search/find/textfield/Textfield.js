/**
 * Поле ввода текста для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.find.textfield.Textfield',
    {
        extend: 'Ext.form.field.Text',
        requires: [
            'FBEditor.view.panel.main.xml.search.find.textfield.TextfieldController'
        ],
        mixins: {
            cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
        },

        xtype: 'panel-xml-search-find-textfield',
        controller: 'panel.xml.search.find.textfield',

        listeners: {
            change: 'onChange',
            keydown: 'onKeydown'
        },
	
	    enableKeyEvents: true,

        getSearchPanel: function ()
        {
            return this.mixins.cmp.getSearchPanel.call(this);
        }
    }
);