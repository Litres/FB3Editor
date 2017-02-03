/**
 * Компонент изображения в панели свойств редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.img.picture.Picture',
	{
		extend: 'FBEditor.view.image.Image',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.img.picture.PictureController'
		],

		xtype: 'panel-props-body-editor-img-picture',
		controller: 'panel.props.body.editor.img.picture',

		style: {
			maxWidth: '150px',
			maxHeight: '200px'
		},
		src: 'undefined',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.props.body.Body} Панель свойств редактора текста
		 */
		panelPropsBody: null,

		/**
		 * Возвращает панель свойств редактора текста.
		 * @return {FBEditor.view.panel.main.props.body.Body}
		 */
		getPanelPropsBody: function ()
		{
			var me = this,
				panel;

			panel = me.panelPropsBody || me.up('panel-props-body');
			me.panelPropsBody = panel;

			return panel;
		}
	}
);