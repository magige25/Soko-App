import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRouteLayer from "./components/PrivateRouteLayer";
import OtpRoutePage from "./pages/OtpRoutePage";
import HomePageOne from "./pages/HomePageOne";
import EmailPage from "./pages/EmailPage";
import AddUserPage from "./pages/AddUserPage";
import AlertPage from "./pages/AlertPage";
import AssignRolePage from "./pages/AssignRolePage";
import AvatarPage from "./pages/AvatarPage";
import BadgesPage from "./pages/BadgesPage";
import ButtonPage from "./pages/ButtonPage";
import CalendarMainPage from "./pages/CalendarMainPage";
import CardPage from "./pages/CardPage";
import CarouselPage from "./pages/CarouselPage";
import ChatEmptyPage from "./pages/ChatEmptyPage";
import ChatMessagePage from "./pages/ChatMessagePage";
import ChatProfilePage from "./pages/ChatProfilePage";
import CodeGeneratorNewPage from "./pages/CodeGeneratorNewPage";
import CodeGeneratorPage from "./pages/CodeGeneratorPage";
import ColorsPage from "./pages/ColorsPage";
import ColumnChartPage from "./pages/ColumnChartPage";
import CompanyPage from "./pages/CompanyPage";
import CurrenciesPage from "./pages/CurrenciesPage";
import DropdownPage from "./pages/DropdownPage";
import ErrorPage from "./pages/ErrorPage";
import FaqPage from "./pages/FaqPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FormLayoutPage from "./pages/FormLayoutPage";
import FormValidationPage from "./pages/FormValidationPage";
import FormPage from "./pages/FormPage";
import GalleryPage from "./pages/GalleryPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import InvoiceAddPage from "./pages/InvoiceAddPage";
import InvoiceEditPage from "./pages/InvoiceEditPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";
import KanbanPage from "./pages/KanbanPage";
import LanguagePage from "./pages/LanguagePage";
import LineChartPage from "./pages/LineChartPage";
import ListPage from "./pages/ListPage";
import MarketplaceDetailsPage from "./pages/MarketplaceDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationAlertPage from "./pages/NotificationAlertPage";
import NotificationPage from "./pages/NotificationPage";
import PaginationPage from "./pages/PaginationPage";
import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import PieChartPage from "./pages/PieChartPage";
import PortfolioPage from "./pages/PortfolioPage";
import PricingPage from "./pages/PricingPage";
import ProgressPage from "./pages/ProgressPage";
import RadioPage from "./pages/RadioPage";
import RoleAccessPage from "./pages/RoleAccessPage";
import SignInPage from "./pages/SignInPage";
import StarRatingPage from "./pages/StarRatingPage";
import StarredPage from "./pages/StarredPage";
import SwitchPage from "./pages/SwitchPage";
import TableBasicPage from "./pages/TableBasicPage";
import TableDataPage from "./pages/TableDataPage";
import TabsPage from "./pages/TabsPage";
import TagsPage from "./pages/TagsPage";
import TermsConditionPage from "./pages/TermsConditionPage";
import TextGeneratorPage from "./pages/TextGeneratorPage";
import ThemePage from "./pages/ThemePage";
import TooltipPage from "./pages/TooltipPage";
import TypographyPage from "./pages/TypographyPage";
import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";
import VideoGeneratorPage from "./pages/VideoGeneratorPage";
import VideosPage from "./pages/VideosPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import VoiceGeneratorPage from "./pages/VoiceGeneratorPage";
import WalletPage from "./pages/WalletPage";
import WidgetsPage from "./pages/WidgetsPage";
import WizardPage from "./pages/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import TextGeneratorNewPage from "./pages/TextGeneratorNewPage";
import GalleryGridPage from "./pages/GalleryGridPage";
import GalleryMasonryPage from "./pages/GalleryMasonryPage";
import GalleryHoverPage from "./pages/GalleryHoverPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import AddBlogPage from "./pages/AddBlogPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import MaintenancePage from "./pages/MaintenancePage";
import BlankPagePage from "./pages/BlankPagePage";
import OtpPage from "./pages/OtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RegionsPage from "./pages/RegionsPage";
import SubRegionsPage from "./pages/SubRegionsPage";
import RoutesPage from "./pages/RoutesPage";
import RegionsDetailsPage from "./pages/RegionsDetailsPage";
import SubRegionsDetailsPage from "./pages/SubRegionsDetailsPage";
import RoutesDetailsPage from "./pages/RoutesDetailsPage";
import AddUsersPage from "./pages/AddUsersPage";
import RolesListPage from "./pages/RolesListPage";
import CreateRolePage from "./pages/CreateRolePage";
import SuppliersPage from "./pages/SuppliersPage";
import PaginationTablePage from "./pages/PaginationTablePage";
import PendingBillsPage from "./pages/PendingSuppliesPage";
import SettledBillsPage from "./pages/SettledBillsPage";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import BrandsPage from "./pages/BrandsPage";
import ProductsPage from "./pages/ProductsPage";
import CountriesPage from "./pages/CountriesPage";
import SalespersonsPage from "./pages/SalespersonsPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerTypePage from "./pages/CustomerTypePage";
import PricingCategoriesPage from "./pages/PricingCategoriesPage";
import CreditorsRequestPage from "./pages/CreditorsRequestPage";
import PendingOrdersPage from "./pages/PendingOrdersPage";
import PendingDeliveriesPage from "./pages/PendingDeliveriesPage";
import SettledOrdersPage from "./pages/SettledOrdersPage";
import UnitsOfMeasurePage from "./pages/UnitsOfMeasurePage";
import AddSuppliersPage from "./pages/AddSuppliersPage";
import SuppliersDetailsPage from "./pages/SuppliersDetailsPage";
import EditSuppliersPage from "./pages/EditSuppliersPage";
import EditUsersPage from "./pages/EditUsersPage";
import UsersDetailsPage from "./pages/UsersDetailsPage";
import SupplyResidencePage from "./pages/SupplyResidencePage";
import DeliveriesPage from "./pages/DeliveriesPage";
import AddDeliveryPage from "./pages/AddDeliveryPage";
import EditDeliveryPage from "./pages/EditDeliveryPage";
import EditProductPage from "./pages/EditProductPage";
import AddProductPage from "./pages/AddProductPage";
import AddImagePage from "./pages/AddImagePage";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true, // Opt into React.startTransition
        v7_relativeSplatPath: true, // Opt into new splat route behavior
      }}
    >
      <AuthProvider>
        <RouteScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SignInPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route element={<OtpRoutePage />}>
            <Route path="/otp" element={<OtpPage />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRouteLayer />}>
            <Route path="/dashboard" element={<HomePageOne />} />
            <Route path="/add-user" element={<AddUserPage />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/assign-role" element={<AssignRolePage />} />
            <Route path="/avatar" element={<AvatarPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/button" element={<ButtonPage />} />
            <Route path="/calendar-main" element={<CalendarMainPage />} />
            <Route path="/calendar" element={<CalendarMainPage />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/carousel" element={<CarouselPage />} />
            <Route path="/chat-empty" element={<ChatEmptyPage />} />
            <Route path="/chat-message" element={<ChatMessagePage />} />
            <Route path="/chat-profile" element={<ChatProfilePage />} />
            <Route path="/code-generator" element={<CodeGeneratorPage />} />
            <Route path="/regions" element={<RegionsPage />} />
            <Route path="/sub-regions" element={<SubRegionsPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/regions/:regionName" element={<RegionsDetailsPage />} />
            <Route path="/sub-regions/:sub-regionName" element={<SubRegionsDetailsPage />} />
            <Route path="/routes/:regionName" element={<RoutesDetailsPage />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/users/add-user" element={<AddUsersPage />} />
            <Route path="/users/details" element={<UsersDetailsPage />} />
            <Route path="/users/edit-user" element={<EditUsersPage />} />
            <Route path="/roles-list" element={<RolesListPage />} />
            <Route path="/create-role" element={<CreateRolePage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/add-supplier" element={<AddSuppliersPage />} />
            <Route path="/suppliers/details" element={<SuppliersDetailsPage />} />
            <Route path="/suppliers/edit-supplier" element={<EditSuppliersPage />} />
            <Route path="/pagination-table" element={<PaginationTablePage />} />
            <Route path="/pending-bills" element={<PendingBillsPage />} />
            <Route path="/settled-bills" element={<SettledBillsPage />} />
            <Route path="/deliveries" element={<DeliveriesPage />} />
            <Route path="/deliveries/edit-delivery" element={<EditDeliveryPage />} />
            <Route path="/deliveries/add-delivery" element={<AddDeliveryPage />} />
            <Route path="/products/add-product" element={<AddProductPage />} />
            <Route path="/products/edit-product" element={<EditProductPage />} />
            <Route path="/supply-residence" element={<SupplyResidencePage />} />          
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/sub-category" element={<SubCategoryPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/salespersons" element={<SalespersonsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customer-type" element={<CustomerTypePage />} />
            <Route path="/pricing-categories" element={<PricingCategoriesPage />} />
            <Route path="/creditors-request" element={<CreditorsRequestPage />} />
            <Route path="/pending-orders" element={<PendingOrdersPage />} />
            <Route path="/pending-deliveries" element={<PendingDeliveriesPage />} />
            <Route path="/settled-orders" element={<SettledOrdersPage />} />
            <Route path="/units-of-measure" element={<UnitsOfMeasurePage />} />
            <Route path="/code-generator-new" element={<CodeGeneratorNewPage />} />
            <Route path="/colors" element={<ColorsPage />} />
            <Route path="/column-chart" element={<ColumnChartPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/currencies" element={<CurrenciesPage />} />
            <Route path="/dropdown" element={<DropdownPage />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/form-layout" element={<FormLayoutPage />} />
            <Route path="/form-validation" element={<FormValidationPage />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery-grid" element={<GalleryGridPage />} />
            <Route path="/gallery-masonry" element={<GalleryMasonryPage />} />
            <Route path="/gallery-hover" element={<GalleryHoverPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog-details" element={<BlogDetailsPage />} />
            <Route path="/add-blog" element={<AddBlogPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/blank-page" element={<BlankPagePage />} />
            <Route path="/image-generator" element={<ImageGeneratorPage />} />
            <Route path="/image-upload" element={<ImageUploadPage />} />
            <Route path="/invoice-add" element={<InvoiceAddPage />} />
            <Route path="/invoice-edit" element={<InvoiceEditPage />} />
            <Route path="/invoice-list" element={<InvoiceListPage />} />
            <Route path="/invoice-preview" element={<InvoicePreviewPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/line-chart" element={<LineChartPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/marketplace-details" element={<MarketplaceDetailsPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/notification-alert" element={<NotificationAlertPage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/pagination" element={<PaginationPage />} />
            <Route path="/payment-gateway" element={<PaymentGatewayPage />} />
            <Route path="/pie-chart" element={<PieChartPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/role-access" element={<RoleAccessPage />} />
            <Route path="/star-rating" element={<StarRatingPage />} />
            <Route path="/starred" element={<StarredPage />} />
            <Route path="/switch" element={<SwitchPage />} />
            <Route path="/table-basic" element={<TableBasicPage />} />
            <Route path="/table-data" element={<TableDataPage />} />
            <Route path="/tabs" element={<TabsPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/terms-condition" element={<TermsConditionPage />} />
            <Route path="/text-generator" element={<TextGeneratorPage />} />
            <Route path="/text-generator-new" element={<TextGeneratorNewPage />} />
            <Route path="/theme" element={<ThemePage />} />
            <Route path="/tooltip" element={<TooltipPage />} />
            <Route path="/typography" element={<TypographyPage />} />
            <Route path="/users-grid" element={<UsersGridPage />} />
            <Route path="/view-details" element={<ViewDetailsPage />} />
            <Route path="/video-generator" element={<VideoGeneratorPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/view-profile" element={<ViewProfilePage />} />
            <Route path="/voice-generator" element={<VoiceGeneratorPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/widgets" element={<WidgetsPage />} />
            <Route path="/wizard" element={<WizardPage />} />
            <Route path="/add-image" element={<AddImagePage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;