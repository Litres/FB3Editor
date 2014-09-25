/**
 * Контроллер панели навигации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.DetachController',
    {
        extend: 'Ext.app.ViewController',

	    /**
	     * Открывает панель в отдельном окне.
	     * @param {FBEditor.view.panel.main.Abstract} panel Панель.
	     */
	    onDetachPanel: function (panel)
	    {
		    var name;

		    name = panel.panelName;
		    panel.close();
		    window.open('#panel/' + name, name, 'top=30,left=30');
		    localStorage.setItem(name, true);
	    }
    }
);