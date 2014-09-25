/**
 * Абстрактный класс основной панели.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.AbstractPanel',
    {
        extend: 'Ext.panel.Panel',
	    /*header: {
		    padding: 5
	    },*/
	    split: {
		    size: 2
	    },
	    bodyPadding: 5
    }
);