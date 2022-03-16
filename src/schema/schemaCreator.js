/**
 * @file        Schema structured data.
 * @module      Schema
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const GAError = require("../utils/gaError");
class SchemaError extends GAError {};

const SchemaBase = require("./schemaBase")
const Thing = require("./classes/thing")
const Action = require("./classes/action")
const ConsumeAction = require("./classes/consumeAction")
const ReadAction = require("./classes/readAction")
const EntryPoint = require("./classes/entryPoint")
const CreativeWork = require("./classes/creativeWork")
const CreativeWorkSeries = require("./classes/creativeWorkSeries")
const MediaObject = require("./classes/mediaObject")
const ImageObject = require("./classes/imageObject");
const WebSite = require('./classes/webSite');
const WebPage = require('./classes/webPage');
const AboutPage = require('./classes/aboutPage');
const ContactPage = require('./classes/contactPage');
const CollectionPage = require('./classes/collectionPage');
const FAQPage = require('./classes/faqPage');
const QAPage = require('./classes/qaPage');
const WebPageElement = require('./classes/webPageElement');
const WPHeader = require('./classes/wpHeader');
const WPFooter = require('./classes/wpFooter');
const SiteNavigationElement = require('./classes/siteNavigationElement');
const Article = require('./classes/article');
const SocialMediaPosting = require('./classes/socialMediaPosting');
const BlogPosting = require('./classes/blogPosting');
const Rating = require('./classes/rating');
const AggregateRating = require('./classes/aggregateRating');
const ItemList = require('./classes/itemList');
const BreadcrumbList = require('./classes/breadcrumbList');
const HowTo = require('./classes/howTo');
const HowToStep = require('./classes/howToStep');
const Organization = require('./classes/organization');
const Place = require('./classes/place');
const LocalBusiness = require('./classes/localBusiness');
const Movie = require('./classes/movie');
const MusicPlaylist = require('./classes/musicPlaylist');
const MusicRecording = require('./classes/musicRecording');
const MusicAlbum = require('./classes/musicAlbum');
const Offer = require('./classes/offer');
const AggregateOffer = require('./classes/aggregateOffer');
const Product = require('./classes/product');
const Review = require('./classes/review');
const TVSeries = require('./classes/tvSeries');
const VideoObject = require('./classes/videoObject');
const Person = require('./classes/person');
const ListItem = require('./classes/listItem');
const SoftwareApplication = require('./classes/softwareApplication');
const MusicGroup = require('./classes/musicGroup');
const Event = require('./classes/event');
const Comment = require('./classes/comment');
const Question = require('./classes/question');
const Answer = require('./classes/answer');
const TypeBase = require('./types/typeBase');
const PriceSpecification = require('./classes/priceSpecification')
const UnitPriceSpecification = require('./classes/unitPriceSpecification')
const QuantitativeValue = require('./classes/quantitativeValue')

/**
 * Schema class.
 */
class SchemaCreator
{
    /**
     * Context.
     * @type    {string}
     */
    static context = "https://schema.org";

    /**
     * Create an ID.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            Prefixed ID. 
     */
    static makeId(raw)
    {
        return SchemaBase.makeId(raw);
    }

    /**
     * Create an ID reference.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            ID reference.
     */
    static ref(raw)
    {
        return SchemaBase.ref(raw);
    }

    /**
     * Create a plain ID.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            Plain ID.
     */
    static plainId(raw)
    {
        return SchemaBase.plainId(raw);
    }

    /**
     * Create generic schema class.
     * 
     * @param   {string}    name    Name.
     * @param   {string}    id      ID.
     * @param   {object}    vals    Values.
     */
    static create(name, id = null, vals = null)
    {
        let orig = name;
        let ext = name;
        let ext2 = name;
        if (name[0].toUpperCase() === name[0]) {
            name = name[0].toLowerCase() + name.substring(1);
        }
        if (name[1].toUpperCase() === name[1]) {
            ext = name[0] + name[1].toLowerCase() + name.substring(2);
        }
        if (ext[2].toUpperCase() === ext[2]) {
            ext2 = ext[0] + ext[1] + ext[2].toLowerCase() + ext.substring(3);
        }
        if (!SchemaCreator[name]) {
            if (!SchemaCreator[orig]) {
                if (!SchemaCreator[ext]) {
                    if (!SchemaCreator[ext2]) {
                        throw new SchemaError(`No schema class definition for '${name}', '${orig}', '${ext}' or '${ext2}'.`);
                    } else {
                        return SchemaCreator[ext2](id, vals);
                    }
                } else {
                    return SchemaCreator[ext](id, vals);
                }
            } else {
                return SchemaCreator[orig](id, vals);
            }
        }
        return SchemaCreator[name](id, vals);
    }

    // ===================================================================
    // Create the various class schema.
    // ===================================================================

    static thing(id = null, vals = null) {return new Thing(id, vals);}

        static creativeWork(id = null, vals = null) {return new CreativeWork(id, vals);}

            static creativeWorkSeries(id = null, vals = null) {return new CreativeWorkSeries(id, vals);}

                static tvSeries(id = null, vals = null) {return new TVSeries(id, vals);}

            static mediaObject(id = null, vals = null) {return new MediaObject(id, vals);}

                static imageObject(id = null, vals = null) {return new ImageObject(id, vals);}

                static videoObject(id = null, vals = null) {return new VideoObject(id, vals);}
            
            static webSite(id = null, vals = null) {return new WebSite(id, vals);}

            static webPage(id = null, vals = null) {return new WebPage(id, vals);}
                                                
                static aboutPage(id = null, vals = null) {return new AboutPage(id, vals);}

                static contactPage(id = null, vals = null) {return new ContactPage(id, vals);}

                static collectionPage(id = null, vals = null) {return new CollectionPage(id, vals);}

                static faqPage(id = null, vals = null) {return new FAQPage(id, vals);}
            
                static qaPage(id = null, vals = null) {return new QAPage(id, vals);}
            
            static webPageElement(id = null, vals = null) {return new WebPageElement(id, vals);}

                static wpHeader(id = null, vals = null) {return new WPHeader(id, vals);}

                static wpFooter(id = null, vals = null) {return new WPFooter(id, vals);}

                static siteNavigationElement(id = null, vals = null) {return new SiteNavigationElement(id, vals);}
            
            static article(id = null, vals = null) {return new Article(id, vals);}

                static socialMediaPosting(id = null, vals = null) {return new SocialMediaPosting(id, vals);}

                    static blogPosting(id = null, vals = null) {return new BlogPosting(id, vals);}

            static movie(id = null, vals = null) {return new Movie(id, vals);}

            static musicPlaylist(id = null, vals = null) {return new MusicPlaylist(id, vals);}

                static musicAlbum(id = null, vals = null) {return new MusicAlbum(id, vals);}

            static musicRecording(id = null, vals = null) {return new MusicRecording(id, vals);}

            static review(id = null, vals = null) {return new Review(id, vals);}

            static softwareApplication(id = null, vals = null) {return new SoftwareApplication(id, vals);}

            static comment(id = null, vals = null) {return new Comment(id, vals);}

                static question(id = null, vals = null) {return new Question(id, vals);}

                static answer(id = null, vals = null) {return new Answer(id, vals);}

        static rating(id = null, vals = null) {return new Rating(id, vals);}

            static aggregateRating(id = null, vals = null) {return new AggregateRating(id, vals);}

        static itemList(id = null, vals = null) {return new ItemList(id, vals);}

            static breadcrumbList(id = null, vals = null) {return new BreadcrumbList(id, vals);}

        static listItem(id = null, vals = null) {return new ListItem(id, vals);}

        static event(id = null, vals = null) {return new Event(id, vals);}

        static howTo(id = null, vals = null) {return new HowTo(id, vals);}

        static howToStep(id = null, vals = null) {return new HowToStep(id, vals);}

        static organization(id = null, vals = null) {return new Organization(id, vals);}

            static localBusiness(id = null, vals = null) {return new LocalBusiness(id, vals);}

            static musicGroup(id = null, vals = null) {return new MusicGroup(id, vals);}

        static place(id = null, vals = null) {return new Place(id, vals);}

        static person(id = null, vals = null) {return new Person(id, vals);}

        static offer(id = null, vals = null) {return new Offer(id, vals);}

            static aggregateOffer(id = null, vals = null) {return new AggregateOffer(id, vals);}

        static product(id = null, vals = null) {return new Product(id, vals);}

        static priceSpecification(id = null, vals = null) {return new PriceSpecification(id, vals);}

            static unitPriceSpecification(id = null, vals = null) {return new UnitPriceSpecification(id, vals);}

        static quantitativeValue(id = null, vals = null) {return new QuantitativeValue(id, vals);}

        static action(id = null, vals = null) {return new Action(id, vals);}
        
            static consumeAction(id = null, vals = null) {return new ConsumeAction(id, vals);}
            
                static readAction(id = null, vals = null) {return new ReadAction(id, vals);}

        static entryPoint(id = null, vals = null) {return new EntryPoint(id, vals);}

    // ===================================================================
    // Create the various type schema.
    // ===================================================================

    static eventStatusType(val) {return new TypeBase('EventStatusType', val);}
    static eventAttendanceMode(val) {return new TypeBase('EventAttendanceMode', val);}
    static itemAvailability(val) {return new TypeBase('ItemAvailability', val);}
}

module.exports = SchemaCreator;
