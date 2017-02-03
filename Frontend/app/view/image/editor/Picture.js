/**
 * Изображение в окне создания/редактирования изображения текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.image.editor.Picture',
	{
		extend: 'FBEditor.view.image.Image',
		xtype: 'image-editor-picture',
		
		style: {
			maxWidth: '150px',
			maxHeight: '200px'
		},
		src: 'undefined'
	}
);