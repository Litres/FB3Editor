/**
 * Кнопка закрытия поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.close.Close',
    {
        extend: 'Ext.Component',
        requires: [
            'FBEditor.view.panel.main.xml.search.close.CloseController'
        ],
        mixins: {
            cmp: 'FBEditor.view.panel.main.xml.search.AbstractComponent'
        },

        xtype: 'panel-xml-search-close',
        controller: 'panel.xml.search.close',
	
	    cls: 'panel-xml-search-close',

        listeners: {
            click: {
                element: 'el',
                fn: 'onClick'
            }
        },

        html: '<i class="fa fa-close"></i>',

        getSearchPanel: function ()
        {
            return this.mixins.cmp.getSearchPanel.call(this);
        }
    }
);