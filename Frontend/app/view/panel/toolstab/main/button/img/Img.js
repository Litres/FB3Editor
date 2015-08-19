/**
 * Кнопка создания элемента img.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.img.Img',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.img.ImgController'
		],
		id: 'panel-toolstab-main-button-img',
		xtype: 'panel-toolstab-main-button-img',
		controller: 'panel.toolstab.main.button.img',
		html: '<i class="fa fa-picture-o"></i>',
		tooltip: 'Изображение (Ctrl+P)',
		elementName: 'img',

		/**
		 * @property {FBEditor.view.window.img.Create} Окно выбора изображения.
		 */
		win: null
	}
);