/**
 * Контроллер панели поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.search.SearchController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.panel.xml.search',
	
	    /**
         * Вызывается при изменении данных поиска.
	     */
	    onChange: function ()
        {
            var me = this,
                view = me.getView(),
                count,
                data,
                xmlPanel,
                manager;

            // получаем данные поиска
            data = view.getDataForSearch();
            
            xmlPanel = view.getXmlPanel();
            manager = xmlPanel.getManager();
            
            // выполняем поиск и получаем количество найденных совпадений
            count = manager.search(data);
	
            // отображаем количество найденных результатов
            view.setCount(count);
        },
	
	    /**
         * Перемещает курсор к следующему найденому результату.
	     */
	    onFindNext: function ()
        {
	        var me = this,
		        view = me.getView(),
		        xmlPanel,
		        manager;
	        
	        xmlPanel = view.getXmlPanel();
	        manager = xmlPanel.getManager();
	        manager.findNext();
        },
	
	    /**
	     * Перемещает курсор к предыдущему найденому результату.
	     */
	    onFindPrev: function ()
	    {
		    var me = this,
			    view = me.getView(),
			    xmlPanel,
			    manager;
		
		    xmlPanel = view.getXmlPanel();
		    manager = xmlPanel.getManager();
		    manager.findPrev();
	    }
    }
);