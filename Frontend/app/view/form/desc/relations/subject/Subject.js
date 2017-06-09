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
				items = me.items,
				isValid = true,
				manager = FBEditor.desc.Manager,
				hiddenCount = 0,
				searchName;

			items.each(
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
				// если все поля данных скрыты, то отмечаем ошибкой первое поле поиска
				isValid = false;
				searchName = me.down('form-desc-relations-subject-searchName');
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

					val = item.getValues();

					if (val)
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