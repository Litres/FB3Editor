/**
 * Поле ID.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.custom.editor.uuid.Uuid',
	{
		extend: 'FBEditor.view.form.desc.field.link.uuid.Link',
		
		xtype: 'form-desc-relations-subject-custom-editor-uuid',

		afterRender: function ()
		{
			var me = this,
				val = me.getValue(),
				manager = FBEditor.desc.Manager;

			me.callParent(arguments);

			if (!val)
			{
				// получаем новый id
				manager.getNewId(
					{
						url: Ext.manifest.hubApiEndpoint + '/pages/machax_persons/',
						property: 'persons',
						fn: me.setSubjectId,
						scope: me
					}
				);
			}
		},

		/**
		 * Устанавливает id в поле.
		 * @param {String} id uuid.
		 */
		setSubjectId: function (id)
		{
			var me = this;

			// обновляем поле ссылки id
			me.setValue(id);

			me.disableLink(true);
		}
	}
);