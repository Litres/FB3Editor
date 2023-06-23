/**
 * Контейнер для отображения данных серий.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.container.desc.search.sequence.Sequence',
	{
		extend: 'FBEditor.view.container.desc.search.Container',
		requires: [
			'FBEditor.view.container.desc.search.sequence.SequenceController',
			'FBEditor.view.container.desc.search.sequence.SequenceStore'
		],
		controller: 'container.desc.search.sequence',
		xtype: 'container-desc-search-sequence',
		cls: 'container-search-sequence',

		translateText: {
			link: 'Страница редактирования',
			searching: 'Поиск серий...',
			notFound: 'Ничего не найдено'
		},

		createStore: function ()
		{
			return Ext.create('FBEditor.view.container.desc.search.sequence.SequenceStore');
		},

		load: function (data)
		{
			var me = this;

			me.maskSearching(false);
			me.fireEvent('afterLoad', data);

			if (data && data.length)
			{
				Ext.Array.each(
					data,
					function (item)
					{
						var container,
							items;

						if (item)
						{
							items = [
								{
									xtype: 'component',
									html: me.getHtmlItems(item),
									afterRender: function ()
									{
										me.afterRenderItem(this);
									}
								}
							];

							container = {
								xtype: 'container',
								width: '100%',
								cls: 'container-sequence-item',
								items: items
							};

							me.add(container);
						}
					}
				);
			}
			else
			{
				me.notFound();
			}

			me.updateLayout();
		},

		/**
		 * @private
		 * Вызывается после добавления записи в контейнер.
		 * @param {Ext.Component} cmp Компонент записи.
		 */
		afterRenderItem: function (cmp)
		{
			var me = this,
				name;

			// добалвяем обработчик события при клике по названию
			name = cmp.getEl().query('.container-sequence-item-name')[0];
			name.addEventListener(
				'click',
				function ()
				{
					var record,
						id;

					id = this.getAttribute('sequence-id');
					record = me.store.getRecord('id', id);
					me.selectFn(record);
				}
			);
		},

		/**
		 * @private
		 * Возвращает html для отображения данных.
		 * @param {Object} data Данные.
		 * @return {String} Строка html.
		 */
		getHtmlItems: function (data)
		{
			var me = this,
				params = me.store.params || {},
				tpl,
				html;

			tpl = new Ext.XTemplate(
				'<div class="container-sequence-item-common">' +
				'   <div class="container-sequence-item-name" sequence-id="{id}">{name}</div>' +
				'   <div class="container-sequence-item-id">{id}</div>' +
				'   <a class="container-sequence-item-link" target="_blank"' +
				'           title="' + me.translateText.link + '"' +
				'           href="' + Ext.manifest.hubApiEndpoint + '/pages/edit_serie/?id={id}">' +
				'       <i class="fa fa-external-link"></i>' +
				'   </a>' +
				'</div>'
			);

			data.name = data.name ? data.name.replace(new RegExp('(' + params.q + ')', 'i'), '<b>$1</b>') : '';
			data.name = data.name.trim();

			html = tpl.apply(data);

			return html;
		}
	}
);