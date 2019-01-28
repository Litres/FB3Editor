/**
 * Кнопка закрытия поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.search.close.Close',
    {
        extend: 'Ext.Component',
        requires: [
            'FBEditor.view.panel.search.close.CloseController'
        ],
        mixins: {
            cmp: 'FBEditor.view.panel.search.AbstractComponent'
        },

        xtype: 'panel-search-close',
        controller: 'panel.search.close',
	
	    cls: 'panel-search-close',

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