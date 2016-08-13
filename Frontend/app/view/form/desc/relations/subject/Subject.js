/**
 * Авторы, правообладатели и другие имеющие отношение к произведению субьекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.item.SubjectItem'
		],

		id: 'form-desc-relations-subject',
		xtype: 'form-desc-relations-subject',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		translateText: {
			error: 'Необходимо заполнить хотя бы одну персону'
		},

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'form-desc-relations-subject-item'
				}
			];

			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				hiddenCount = 0,
				items = me.query('form-desc-relations-subject-container-custom'),
				searchName = me.down('form-desc-relations-subject-searchName'),
				isValid = true,
				manager = FBEditor.desc.Manager;

			Ext.Array.each(
				items,
				function (item)
				{
					if (item.isHidden())
					{
						hiddenCount++;
						isValid = true;
					}
					else if (!item.isValid())
					{
						isValid = false;

						return false;
					}
				}
			);

			if (isValid && hiddenCount === items.length)
			{
				// если все поля скрыты
				isValid = false;
				searchName.markInvalid(me.translateText.error);
				manager.fieldsError.push(searchName);
			}

			return isValid;
		},

		getValues: function (d)
		{
			var me = this,
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = {
						_id: item.down('[name=relations-subject-id]').getValue(),
						_link: item.down('form-desc-relations-subject-link').getValue(),
						_percent: item.down('[name=relations-subject-percent]').getValue(),
						title: item.down('[name=relations-subject-title]').getValues(),
						'first-name': item.down('[name=relations-subject-first-name]').getValue(),
						'middle-name': item.down('[name=relations-subject-middle-name]').getValue(),
						'last-name': item.down('[name=relations-subject-last-name]').getValue()
					};
					val = me.removeEmptyValues(val);
					if (val && val._id)
					{
						values = values || [];
						values.push(val);
					}
				}
			);
			data['fb3-relations'] = data['fb3-relations'] || {};
			data['fb3-relations'].subject = values;

			return data;
		}
	}
);