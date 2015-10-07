/**
 * Схема XSD для описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>\
 */

Ext.define(
	'FBEditor.xsd.Desc',
	{
		singleton: true,

		/**
		 * Вовзращает xsd.
		 * @return {String} Строка xsd.
		 */
		getXsd: function ()
		{
			var xsd;

			xsd = '\
<?xml version="1.0" encoding="UTF-8"?>\
<schema xmlns="http://www.w3.org/2001/XMLSchema" xmlns:fb3d="http://www.fictionbook.org/FictionBook3/description" \
targetNamespace="http://www.fictionbook.org/FictionBook3/description" elementFormDefault="qualified" \
attributeFormDefault="unqualified">\
\
	<simpleType name="SubjectRelationEnumType">\
				  <restriction base="token">\
				      <enumeration value="author" />\
				      <enumeration value="translator" />\
				      <enumeration value="editor" />\
				      <enumeration value="compiler" />\
				      <enumeration value="maker-up" />\
				      <enumeration value="adapter" />\
				      <enumeration value="dialogue" />\
				      <enumeration value="conceptor" />\
				      <enumeration value="reviewer" />\
				      <enumeration value="introduction" />\
				      <enumeration value="afterword" />\
				      <enumeration value="accompanying" />\
				      <enumeration value="quotations" />\
				      <enumeration value="annotator" />\
				      <enumeration value="associated" />\
				      <enumeration value="copyright_holder" />\
				      <enumeration value="commentator" />\
				      <enumeration value="consultant" />\
				      <enumeration value="corrector" />\
				      <enumeration value="scientific_advisor" />\
				      <enumeration value="dubious_author" />\
				      <enumeration value="designer" />\
				      <enumeration value="recipient_of_letters" />\
				      <enumeration value="sponsor" />\
				      <enumeration value="photographer" />\
				      <enumeration value="narrator" />\
				      <enumeration value="rendering" />\
				      <enumeration value="performer">\
					</enumeration>\
					<enumeration value="maker">\
					</enumeration>\
					<enumeration value="actor">\
					</enumeration>\
					<enumeration value="director">\
					</enumeration>\
					<enumeration value="producer">\
					</enumeration>\
					<enumeration value="composer">\
					</enumeration>\
					<enumeration value="sound_engineer">\
					</enumeration>\
					<enumeration value="screenwriter">\
					</enumeration>\
				      <enumeration value="other" />\
				      <enumeration value="undef" />\
			      </restriction>\
		</simpleType>\
          <simpleType name="ObjectRelationEnumType">\
	          <restriction base="token">\
		          <enumeration value="preceding_edition" />\
		          <enumeration value="following_edition" />\
		          <enumeration value="translated_from" />\
		          <enumeration value="translation" />\
		          <enumeration value="compilation" />\
		          <enumeration value="part" />\
		          <enumeration value="appendix" />\
		          <enumeration value="appendix_to" />\
		          <enumeration value="intersection" />\
		          <enumeration value="same_subject" />\
		          <enumeration value="alt_media" />\
		          <enumeration value="sequel" />\
		          <enumeration value="prequel" />\
		          <enumeration value="reissue" />\
		          <enumeration value="undef" />\
	          </restriction>\
          </simpleType>\
\
	<simpleType name="UUIDType">\
			 <restriction base="token">\
				 <pattern value="[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"/>\
			 </restriction>\
		</simpleType>\
	\
	<simpleType name="BookClassType">\
				  <restriction base="token">\
				      <enumeration value="novel" />\
				      <enumeration value="short_story" />\
				      <enumeration value="essay" />\
				      <enumeration value="article" />\
				      <enumeration value="play" />\
				      <enumeration value="monograph" />\
				      <enumeration value="diary" />\
				      <enumeration value="manual" />\
				      <enumeration value="thesis" />\
				  </restriction>\
		</simpleType>\
	\
		<simpleType name="SubjectType">\
			 <restriction base="token">\
			  <enumeration value="accounting" />\
			  <enumeration value="adv_geo" />\
			  <enumeration value="adv_indian" />\
			  <enumeration value="adv_western" />\
			  <enumeration value="antique" />\
			  <enumeration value="antique_east" />\
			  <enumeration value="antique_myths" />\
			  <enumeration value="banking" />\
			  <enumeration value="child_det" />\
			  <enumeration value="child_prose" />\
			  <enumeration value="child_tale" />\
			  <enumeration value="children" />\
			  <enumeration value="comp_hard" />\
			  <enumeration value="comp_programming" />\
			  <enumeration value="comp_www" />\
			  <enumeration value="design" />\
			  <enumeration value="det_classic" />\
			  <enumeration value="det_espionage" />\
			  <enumeration value="det_history" />\
			  <enumeration value="det_maniac" />\
			  <enumeration value="det_political" />\
			  <enumeration value="economics" />\
			  <enumeration value="global_economy" />\
			  <enumeration value="home_crafts" />\
			  <enumeration value="home_entertain" />\
			  <enumeration value="home_health" />\
			  <enumeration value="home_sex" />\
			  <enumeration value="humor_anecdote" />\
			  <enumeration value="humor_verse" />\
			  <enumeration value="job_hunting" />\
			  <enumeration value="love_detective" />\
			  <enumeration value="love_history" />\
			  <enumeration value="love_short" />\
			  <enumeration value="marketing" />\
			  <enumeration value="nonf_criticism" />\
			  <enumeration value="nonfiction" />\
			  <enumeration value="paper_work" />\
			  <enumeration value="poetry" />\
			  <enumeration value="prose_classic" />\
			  <enumeration value="prose_counter" />\
			  <enumeration value="prose_military" />\
			  <enumeration value="prose_su_classics" />\
			  <enumeration value="ref_dict" />\
			  <enumeration value="ref_guide" />\
			  <enumeration value="reference" />\
			  <enumeration value="religion_esoterics" />\
			  <enumeration value="religion_self" />\
			  <enumeration value="sci_chem" />\
			  <enumeration value="sci_history" />\
			  <enumeration value="sci_linguistic" />\
			  <enumeration value="sci_medicine" />\
			  <enumeration value="sci_phys" />\
			  <enumeration value="sci_psychology" />\
			  <enumeration value="sci_tech" />\
			  <enumeration value="sf_action" />\
			  <enumeration value="sf_detective" />\
			  <enumeration value="sf_fantasy" />\
			  <enumeration value="sf_history" />\
			  <enumeration value="sf_humor" />\
			  <enumeration value="sf_space" />\
			  <enumeration value="stock" />\
			 </restriction>\
		</simpleType>\
	\
                        <element name="fb3-description">\
	                        	                        <complexType>\
		                        <sequence>\
			                        <element name="periodical" type="fb3d:PeriodicalType" minOccurs="0">\
				                        			                        </element>\
			                        <element name="title" type="fb3d:TitleType">\
				                        			                        </element>\
			                        <element name="sequence" type="fb3d:SequenceType" minOccurs="0" maxOccurs="unbounded">\
				                        			                        </element>\
			                        <element ref="fb3d:fb3-relations">\
				                        			                        </element>\
			                        <element ref="fb3d:fb3-classification">\
				                        			                        </element>\
			                        <element name="lang" type="language"/>\
			                        <element name="written" minOccurs="0">\
				                        <complexType mixed="false">\
					                        <sequence>\
						                        <element name="lang" type="language" minOccurs="0"/>\
						                        <element name="date" minOccurs="0">\
							                        <complexType>\
								                        <simpleContent>\
									                        <extension base="string">\
										                        <attribute name="value" type="date" use="optional"/>\
									                        </extension>\
								                        </simpleContent>\
							                        </complexType>\
						                        </element>\
						                        <element name="country" minOccurs="0">\
							                        <simpleType>\
								                        <restriction base="token">\
									                        <minLength value="2"/>\
								                        </restriction>\
							                        </simpleType>\
						                        </element>\
						                        <element name="date-translation" type="date" minOccurs="0"/>\
						                        <element name="date-public" type="date" minOccurs="0"/>\
					                        </sequence>\
				                        </complexType>\
			                        </element>\
			                        <element name="document-info">\
				                        <complexType mixed="false">\
					                        <attribute name="created" type="dateTime" use="required"/>\
					                        <attribute name="updated" type="dateTime" use="required"/>\
					                        <attribute name="program-used" type="normalizedString" use="optional"/>\
					                        <attribute name="src-url" type="anyURI" use="optional"/>\
					                        <attribute name="ocr" type="normalizedString" use="optional"/>\
					                        <attribute name="editor" type="token" use="optional"/>\
					                        <attribute name="fb3-lvl" type="integer" use="optional"/>\
				                        </complexType>\
			                        </element>\
			                        <element name="history" type="fb3d:AnnotationType" minOccurs="0"/>\
			                        <element name="publish-info" minOccurs="0" maxOccurs="unbounded">\
										<complexType mixed="false">\
											<sequence>\
												<element name="isbn" type="fb3d:ISBNType" minOccurs="0" maxOccurs="unbounded"/>\
											</sequence>\
											<attribute name="title" type="token" use="required"/>\
											<attribute name="publisher" type="token" use="optional"/>\
											<attribute name="city" type="token" use="optional"/>\
											<attribute name="year" type="gYear" use="optional"/>\
											<attribute name="biblio-description" type="token" use="optional"/>\
										</complexType>\
									</element>\
			                        <element name="custom-info" minOccurs="0" maxOccurs="unbounded">\
				                        				                        <complexType>\
					                        <simpleContent>\
						                        <extension base="string">\
							                        <attribute name="info-type" use="required">\
								                        <simpleType>\
									                        <restriction base="token">\
										                        <minLength value="1"/>\
									                        </restriction>\
								                        </simpleType>\
							                        </attribute>\
						                        </extension>\
					                        </simpleContent>\
				                        </complexType>\
			                        </element>\
			                        <element name="annotation" type="fb3d:AnnotationType" minOccurs="0"/>\
			                        <element name="preamble" type="fb3d:AnnotationType" minOccurs="0"/>\
		                        </sequence>\
		                        <attribute name="id" type="fb3d:UUIDType" use="required">\
			                        		                        </attribute>\
		                        <attribute name="version" type="float" use="required">\
			                        		                        </attribute>\
	                        </complexType>\
	                        <unique name="RelationUUID">\
		                        <selector xpath="relations/subject|relations/object"/>\
		                        <field xpath="@id"/>\
	                        </unique>\
                        </element>\
<element name="fb3-relations" type="fb3d:RelationsType">\
                                   </element>\
  <element name="fb3-classification" type="fb3d:ClassificationType">\
	    </element>\
<complexType name="PeriodicalType" mixed="false">\
		 <sequence>\
	<element name="title" type="fb3d:TitleType" minOccurs="0">\
	 	</element>\
	<element name="issn" type="fb3d:ISSNType" minOccurs="0">\
	    	</element>\
  <element name="issue">\
	  	  <complexType>\
		  <simpleContent>\
			  <extension base="string">\
				  <attribute name="number" type="positiveInteger" use="required">\
					  				  </attribute>\
				  <attribute name="year" type="gYear" use="required">\
					  				  </attribute>\
				  <attribute name="date" type="date" use="optional">\
					  				  </attribute>\
			  </extension>\
		  </simpleContent>\
	  </complexType>\
  </element>\
</sequence>\
<attribute name="id" type="fb3d:UUIDType" use="required"/>\
</complexType>\
<complexType name="ClassificationType" mixed="false">\
    <sequence>\
      <element name="class" minOccurs="0">\
                    <complexType>\
	          <simpleContent>\
		          <extension base="fb3d:BookClassType">\
			          <attribute name="contents" use="required">\
				          <simpleType>\
					          <restriction base="token">\
						          <enumeration value="standalone" />\
						          <enumeration value="collection" />\
						      </restriction>\
				          </simpleType>\
			          </attribute>\
		          </extension>\
	          </simpleContent>\
          </complexType>\
      </element>\
      <element name="subject" type="fb3d:SubjectType" maxOccurs="unbounded">\
                </element>\
      <element name="target-audience" minOccurs="0">\
                    <complexType mixed="true">\
	          <attribute name="age-min" use="optional">\
		          <simpleType>\
			          <restriction base="positiveInteger">\
				          <minInclusive value="2"/>\
				          <maxInclusive value="50"/>\
			          </restriction>\
		          </simpleType>\
	          </attribute>\
	          <attribute name="age-max" use="optional">\
		          <simpleType>\
			          <restriction base="positiveInteger">\
				          <minInclusive value="2"/>\
				          <maxInclusive value="150"/>\
			          </restriction>\
		          </simpleType>\
	          </attribute>\
	          <attribute name="education" use="optional">\
		          <simpleType>\
			          <restriction base="token">\
				          <enumeration value="none" />\
				          <enumeration value="high" />\
				          <enumeration value="higher" />\
			          </restriction>\
		          </simpleType>\
	          </attribute>\
          </complexType>\
      </element>\
      <element name="setting" minOccurs="0">\
          <complexType mixed="true">\
	          <attribute name="country" type="token" use="optional"/>\
	          <attribute name="place" type="token" use="optional"/>\
	          <attribute name="date" type="date" use="optional"/>\
	          <attribute name="date-from" type="date" use="optional"/>\
	          <attribute name="date-to" type="date" use="optional"/>\
	          <attribute name="age" type="token" use="optional"/>\
          </complexType>\
      </element>\
      <element name="udc" minOccurs="0" maxOccurs="unbounded">\
                    <simpleType>\
	          <restriction base="token">\
		          <pattern value="[\\d\\. \\*\\(\\)\\[\\]\\+:«»\'/A-Яа-я]+"/>\
	          </restriction>\
          </simpleType>\
      </element>\
      <element name="bbk" minOccurs="0" maxOccurs="unbounded">\
                    <simpleType>\
	          <restriction base="token">\
		          <pattern value="[\\(\\)\\d\\.\\-A-Яа-я/\\+ ]+"/>\
	          </restriction>\
          </simpleType>\
      </element>\
  </sequence>\
</complexType>\
<complexType name="TitleType" mixed="false">\
	<sequence>\
	    <element name="main">\
	        <simpleType>\
	            <restriction base="string">\
	                <minLength value="1"/>\
	            </restriction>\
	        </simpleType>\
	    </element>\
		<element name="sub" minOccurs="0">\
            <simpleType>\
				<restriction base="string">\
					<minLength value="1"/>\
				</restriction>\
			</simpleType>\
		</element>\
		<element name="alt" minOccurs="0" maxOccurs="unbounded">\
			<simpleType>\
				<restriction base="string">\
					<minLength value="1"/>\
				</restriction>\
			</simpleType>\
		</element>\
	</sequence>\
</complexType>\
<complexType name="SequenceType" mixed="false">\
    <sequence>\
      <element name="title" type="fb3d:TitleType"/>\
      <element name="sequence" type="fb3d:SequenceType" minOccurs="0"/>\
  </sequence>\
  <attribute name="number" type="positiveInteger" use="optional"/>\
  <attribute name="id" type="fb3d:UUIDType" use="required"/>\
</complexType>\
<complexType name="AnnotationType">\
                                <sequence>\
              <element name="p" type="fb3d:BasicTextType">\
	                            </element>\
<choice minOccurs="0" maxOccurs="unbounded">\
                                <element name="p" type="fb3d:BasicTextType">\
	                                                                </element>\
<element name="br">\
              </element>\
  </choice>\
  </sequence>\
</complexType>\
<complexType name="BasicTextType" mixed="true">\
    <choice minOccurs="0" maxOccurs="unbounded">\
      <element name="strong" type="fb3d:BasicTextType">\
                </element>\
      <element name="em" type="fb3d:BasicTextType">\
                </element>\
      <element name="a">\
                    <complexType mixed="true">\
	          <complexContent mixed="true">\
		          <extension base="fb3d:BasicTextType">\
			          <attribute name="href" type="anyURI" use="required"/>\
		          </extension>\
	          </complexContent>\
          </complexType>\
      </element>\
  </choice>\
</complexType>\
<complexType name="RelationsType">\
                                <sequence>\
              <element name="subject" type="fb3d:SubjectRelationType" maxOccurs="unbounded">\
	                            </element>\
<element name="object" type="fb3d:ObjectRelationType" minOccurs="0" maxOccurs="unbounded"/>\
                                                                              </sequence>\
                                                                              </complexType>\
<complexType name="SubjectRelationType" mixed="false">\
                                              	                                              <sequence>\
                                              <element name="title" type="fb3d:TitleType">\
	                                                                                            </element>\
<element name="first-name" minOccurs="0">\
                                     	                                     <simpleType>\
                                     <restriction base="string">\
	                                     <minLength value="1"/>\
                                     </restriction>\
</simpleType>\
  </element>\
	  <element name="middle-name" minOccurs="0">\
		  		  <simpleType>\
			  <restriction base="string">\
				  <minLength value="1"/>\
			  </restriction>\
		  </simpleType>\
	  </element>\
	  <element name="last-name">\
		  		  <simpleType>\
			  <restriction base="string">\
				  <minLength value="1"/>\
			  </restriction>\
		  </simpleType>\
	  </element>\
	  <element name="description" minOccurs="0">\
		  		  <simpleType>\
			  <restriction base="string">\
				  <minLength value="1"/>\
			  </restriction>\
		  </simpleType>\
	  </element>\
  </sequence>\
<attribute name="id" type="fb3d:UUIDType" use="required">\
                                          </attribute>\
  <attribute name="link" type="fb3d:SubjectRelationEnumType" use="required">\
	    </attribute>\
	<attribute name="percent" type="optional"/>\
</complexType>\
<complexType name="ObjectRelationType" mixed="false">\
    <sequence>\
      <element name="title" type="fb3d:TitleType">\
                </element>\
      <element name="description" minOccurs="0">\
                    <simpleType>\
	          <restriction base="string">\
		          <minLength value="1"/>\
	          </restriction>\
          </simpleType>\
      </element>\
  </sequence>\
  <attribute name="id" type="fb3d:UUIDType" use="required">\
        </attribute>\
  <attribute name="link" type="fb3d:ObjectRelationEnumType" use="required">\
        </attribute>\
</complexType>\
<simpleType name="ISSNType">\
             <restriction base="string">\
                  <pattern value="\d{4}-\d{3}(\d|X)"/>\
</restriction>\
  </simpleType>\
	  <simpleType name="ISBNType">\
		  		  <restriction base="string">\
			  <pattern value="([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]"/>\
		  </restriction>\
	  </simpleType>\
  </schema>\
			';

			return xsd;
		}
	}
);