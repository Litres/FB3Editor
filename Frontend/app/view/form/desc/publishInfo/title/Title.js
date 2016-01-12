/**
 * Поле Название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.title.Title',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.publishInfo.title.TitleController'
		],
		xtype: 'form-desc-publishInfo-title',
		controller: 'form.desc.publishInfo.title',
		listeners: {
			change: 'onChange',
			focus: 'onFocus',
			copyTitle: 'onCopyTitle'
		},

		/**
		 * @property {Boolean} Изменялось ли значение поля.
		 */
		isChanged: false
	}
);