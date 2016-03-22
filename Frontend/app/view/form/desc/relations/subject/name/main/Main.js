/**
 * Поле фамилии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.name.main.Main',
	{
		extend: 'FBEditor.view.form.desc.relations.subject.name.Name',
		mixins: {
			required: 'FBEditor.view.form.desc.field.Required'
		},
		xtype: 'form-desc-relations-subject-name-main',
		allowBlank: false,

		_cls: 'field-required',

		listeners: {
			dirtychange: function ()
			{
				this.checkChangeCls();
			}
		},

		afterRender: function ()
		{
			var me = this;

			me.callParent(arguments);

			me.checkChangeCls();
		},

		/**
		 * Изменяет класс в зависимости от валидности.
		 */
		checkChangeCls: function ()
		{
			this.mixins.required.checkChangeCls.call(this);
		}
	}
);