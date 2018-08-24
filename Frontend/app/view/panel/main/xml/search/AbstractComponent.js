/**
 * Абстрактный класс компонента панели поиска.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.AbstractComponent',
    {
        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.search.Search} Панель поиска.
         */
        searchPanel: null,

        /**
         * Возвращает панель поиска.
         * @return {FBEditor.view.panel.main.xml.search.Search}
         */
        getSearchPanel: function ()
        {
            var me = this,
                panel;

            panel = me.searchPanel || me.up('panel-xml-search');
            me.searchPanel = panel;

            return panel;
        }
    }
);