/**
 * Кнопка создания элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.img.Img',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.window.img.Create'
		],
		id: 'panel-toolstab-main-button-img',
		xtype: 'panel-toolstab-main-button-img',
		//controller: 'panel.toolstab.main.button.img',
		html: '<i class="fa fa-picture-o"></i>',
		tooltip: 'Изображение',

		/**
		 * @property {FBEditor.view.window.img.Create} Окно выбора изображения.
		 */
		win: null,

		handler: function ()
		{
			var win,
				sel,
				range;

			sel = FBEditor.editor.Manager.getSelection();
			if (sel)
			{
				win = this.win || Ext.create('FBEditor.view.window.img.Create');

				// сохраняем данные текущего выделения
				range = sel.getRangeAt(0);
				win.selectionRange = {
					start: range.startContainer,
					offset: range.startOffset,
					oldValue: range.startContainer.nodeValue
				};

				this.win = win;
				win.show();
			}
		}
	}
);