/**
 * Контроллер компонента изображения на панели свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.img.picture.PictureController',
	{
		extend: 'FBEditor.view.image.ImageController',

		alias: 'controller.panel.props.body.editor.img.picture',

		onLoad: function ()
		{
			var me = this,
				view = me.getView(),
				panel;

			// обновляем макет панели свойств
			panel = view.getPanelPropsBody();
			panel.updateLayout();
		}
	}
);