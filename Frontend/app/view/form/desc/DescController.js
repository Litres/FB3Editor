/**
 * Контроллер формы описания.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.DescController',
	{
		extend: 'Ext.app.ViewController',
		requires: [
			'FBEditor.converter.desc.Data'
		],
		alias: 'controller.form.desc',

		/**
		 * Выполняется после активации панели.
		 * @param {FBEditor.view.form.desc.Desc} self
		 */
		onActivate: function (self)
		{
			var me = self,
				items = me.items;

			if (!me._firstActivate)
			{
				me._firstActivate = true;
				items.each(
					function (item)
					{
						var req = item.require,
							autoExpand = item.autoExpand,
							collapsed;

						collapsed = req && autoExpand ? false : true;
						if (collapsed)
						{
							item.collapse();
						}
					}
				);
			}
		},

		/**
		 * Загружает данные в форму.
		 * @param {Object} df Данные, полученные из книги.
		 */
		onLoadData:  function (df)
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				converter,
				data;

			converter = FBEditor.converter.desc.Data;
			data = converter.toForm(df);
			//console.log(data);
			view.fireEvent('reset');
			form.setValues(data);
			Ext.getCmp('form-desc-sequence').fireEvent('loadData', data.sequence);
			Ext.getCmp('form-desc-title').down('form-desc-title-alt').fireEvent('loadData', data['title-alt']);
			Ext.getCmp('form-desc-periodical').down('form-desc-title-alt').
				fireEvent('loadData', data['periodical-title-alt']);
			Ext.getCmp('form-desc-relations-subject').fireEvent('loadData', data.relations['relations-subject']);
			Ext.getCmp('form-desc-classification-udk').fireEvent('loadData', data['classification-udk']);
			Ext.getCmp('form-desc-classification-bbk').fireEvent('loadData', data['classification-bbk']);
			Ext.getCmp('form-desc-subject').fireEvent('loadData', data['classification-subject']);
			Ext.getCmp('form-desc-relations-object').fireEvent('loadData', data.relations['relations-object']);
			Ext.getCmp('form-desc-publishInfo').fireEvent('loadData', data['publish-info']);
			Ext.getCmp('form-desc-customInfo').fireEvent('loadData', data['custom-info']);
			//Ext.getCmp('classification-custom-subject').fireEvent('loadData', data['classification-custom-subject']);
			me.expandFieldset(data);
		},

		/**
		 * Сбрасывает поля и блоки формы.
		 */
		onReset:  function ()
		{
			var me = this,
				view = me.getView(),
				form = view.getForm(),
				fieldContainers;

			// передаем событие resetFields всем необходимым компонентам
			fieldContainers = view.query('[name=form-desc-plugin-fieldcontainerreplicator],' +
			                             'form-desc-title, fieldset, form-desc-relations-subject-link');
			Ext.each(
				fieldContainers,
			    function (item)
			    {
				    item.fireEvent('resetFields');
			    }
			);

			// очищаем поля формы
			form.reset();
		},

		/**
		 * Разворачивает необязательные блоки fieldset, в которых есть данные.
		 * @param {Object} data Данные.
		 */
		expandFieldset: function (data)
		{
			var me = this,
				view = me.getView(),
				fields;

			fields = view.query('fieldset');
			Ext.each(
				fields,
				function (item)
				{
					item.fireEvent('checkExpand');
				}
			);
		}
	}
);