/**
 * Контролер формы редактирования изображения маркера элемента div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.div.marker.img.ImgController',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditorController',
		alias: 'controller.panel.props.body.editor.marker.img',

		onChange: function ()
		{
			var me = this,
				view = me.getView();

			// оповещаем основную форму
			view.up('panel-props-body-editor-div').fireEvent('change');
		}
	}
);