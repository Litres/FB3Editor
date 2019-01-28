/**
 * Поле ввода текста для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.search.find.textfield.Textfield',
    {
        extend: 'Ext.form.field.Text',
        requires: [
            'FBEditor.view.panel.search.find.textfield.TextfieldController'
        ],
        mixins: {
            cmp: 'FBEditor.view.panel.search.AbstractComponent'
        },

        xtype: 'panel-search-find-textfield',
        controller: 'panel.search.find.textfield',

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