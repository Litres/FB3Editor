/**
 * Контроллер отсоединенной панели.
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
		    var name,
			    box;

		    name = panel.panelName;
		    box = panel.getBox();
		    window.open('#panel/' + name, name,
			    'width=' + box.width +
				',height=' + box.height +
			    ',top=' + box.top +
				',left=' + box.left +
				',toolbar=no' +
				',location=no');
	    }
    }
);