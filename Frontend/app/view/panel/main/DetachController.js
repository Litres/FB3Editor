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
	     * Вызывается при изменении размеров панели.
	     * @param {FBEditor.view.panel.main.AbstractDetach} cmp Отсоединяемая панель.
	     * @param {Number} width
	     * @param {Number} height
	     * @param {Number} oldWidth
	     * @param {Number} oldHeight
	     */
	    onResize: function (cmp, width, height, oldWidth, oldHeight)
	    {
		    // проверка изменения ширины
		    if (width !== oldWidth)
		    {
			    Ext.getCmp('main').fireEvent('checkWidthPanels');
		    }
	    },

	    /**
	     * Открывает панель в отдельном окне.
	     * @param {FBEditor.view.panel.main.Abstract} panel Панель.
	     */
	    onDetachPanel: function (panel)
	    {
		    var name,
			    box,
			    win;

		    name = panel.panelName;
		    box = panel.getBox();

		    win = window.open('#panel/' + name, name,
			    'width=' + box.width +
				',height=' + box.height +
			    ',top=' + box.top +
				',left=' + box.left +
				',toolbar=no' +
				',location=no');

		    if (win)
		    {
			    // сохраняем ссылку на дочернее окно
			    FBEditor.childWindow[name] = win;
		    }
	    }
    }
);